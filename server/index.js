import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'
import { fileURLToPath } from 'url';

// Config path for usability in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: ['http://localhost:5173'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	})
);

app.use(express.static(path.resolve(__dirname, './')));
app.use(express.static(path.resolve(__dirname, '../src')));
app.use(express.static(path.resolve(__dirname, '../index.html')));

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`😘 Server is running on PORT ${PORT}`);
  console.log(`🌴 Current environment: ${process.env.NODE_ENV}`);
});

// Catch-all Route
app.use('*', (req, res) => {
  res.status(404).json('Page Not Found');
});

// Global Error Handler
app.use((err, req, res, next) => {
  const defaultError = {
    log: `😱 Unknown middleware error: ${err}`,
    status: 500,
    message: { err: 'An error occurred' },
  };

  const customError = Object.assign({}, defaultError, err);
  console.log(customError.log);
  return res.status(customError.status).json(customError.message);
});

// Graceful Shutdown Function
let isShuttingDown = false;

const gracefulShutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('👂 Received Shut Down Signal. Gracefully Shutting Down...');

  try {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        resolve();
      });
    });
  } catch (error) {
    console.error(`😭 Unable to gracefully shut down the server. Force exiting... - ${error}`);
    process.exitCode = 1;
  }
};

// Shutdown Signals
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);