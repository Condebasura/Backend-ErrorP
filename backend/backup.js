
import sqlite3 from 'sqlite3';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

const carpetaDB = path.join(os.homedir(), 'datos-errorpris');
const carpetaBackup = path.join(os.homedir(), 'backups-errorpris');

const origen = path.join(carpetaDB, 'DataBase.db');
const MAX_COPIAS = 7;

fs.mkdirSync(carpetaBackup, { recursive: true });

const fecha = new Date()
  .toISOString()
  .replace(/:/g, '-')
  .replace(/\./g, '-');

const destino = path.join(
  carpetaBackup,
  `DataBase-${fecha}.db`
);

function verificarBackup(continuar) {
  const comprobacion = new sqlite3.Database(
    destino,
    sqlite3.OPEN_READONLY,
    (err) => {
      if (err) {
        console.error('No se pudo abrir el backup:', err.message);
        process.exitCode = 1;
        return;
      }

      comprobacion.get('PRAGMA integrity_check', (error, fila) => {
        if (error || fila?.integrity_check !== 'ok') {
          console.error(
            'El backup no superó la comprobación de integridad.',
            error?.message ?? fila?.integrity_check
          );
          process.exitCode = 1;

          comprobacion.close();
          return;
        }

        comprobacion.close((closeError) => {
          if (closeError) {
            console.error('Error al cerrar la verificación:', closeError.message);
            process.exitCode = 1;
            return;
          }

          console.log('Integridad del backup verificada.');
          continuar();
        });
      });
    }
  );
}

function conservarUltimasCopias() {
  const archivos = fs.readdirSync(carpetaBackup)
    .filter((nombre) =>
      /^DataBase-\d{4}-\d{2}-\d{2}T.*\.db$/.test(nombre)
    )
    .sort()
    .reverse();

  const antiguos = archivos.slice(MAX_COPIAS);

  for (const nombre of antiguos) {
    fs.unlinkSync(path.join(carpetaBackup, nombre));
    console.log('Backup antiguo eliminado:', nombre);
  }

  console.log(
    `Proceso finalizado. Copias conservadas: ${Math.min(archivos.length, MAX_COPIAS)}`
  );
}

function crearBackup() {
  if (!fs.existsSync(origen)) {
    console.error('No existe la base original:', origen);
    process.exitCode = 1;
    return;
  }

  const db = new sqlite3.Database(
    origen,
    sqlite3.OPEN_READONLY,
    (err) => {
      if (err) {
        console.error('Error al abrir la base:', err.message);
        process.exitCode = 1;
        return;
      }

      const backup = db.backup(destino, (backupErr) => {
        if (backupErr) {
          console.error('Error al iniciar el backup:', backupErr.message);
          process.exitCode = 1;
          db.close();
          return;
        }

        backup.step(-1, (stepErr) => {
          if (stepErr) {
            console.error('Error al copiar la base:', stepErr.message);
            process.exitCode = 1;
            db.close();
            return;
          }

          db.close((closeErr) => {
            if (closeErr) {
              console.error('Error al cerrar SQLite:', closeErr.message);
              process.exitCode = 1;
              return;
            }

            console.log('Copia creada:', destino);

            verificarBackup(conservarUltimasCopias);
          });
        });
      });
    }
  );
}

crearBackup();

