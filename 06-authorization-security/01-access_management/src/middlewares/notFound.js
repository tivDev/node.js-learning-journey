// src/middlewares/notFound.js

module.exports = (req, res, next) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>404 Not Found</title>
        <style>
          /*
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif
          */
          body {
            margin: 0;
            background: #f2f2f7;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #1c1c1e;
          }

          .card {
            background: #ffffff;
            border-radius: 28px;
            padding: 40px 36px;
            max-width: 360px;
            box-shadow:
              0 10px 20px rgba(0, 0, 0, 0.12),
              0 4px 8px rgba(0, 0, 0, 0.08);
            text-align: center;
          }

          .icon {
            margin-bottom: 20px;
            width: 72px;
            height: 72px;
            stroke: #ff3b30;
            stroke-width: 2.5;
            stroke-linecap: round;
            stroke-linejoin: round;
          }

          h1 {
            font-weight: 700;
            font-size: 72px;
            margin: 0;
            color: #ff3b30;
            letter-spacing: -0.04em;
            line-height: 1;
          }

          h2 {
            font-weight: 600;
            font-size: 24px;
            margin: 12px 0 18px;
            color: #3c3c4399; 
          }

          p {
            font-weight: 400;
            font-size: 17px;
            margin: 0 0 32px;
            line-height: 1.4;
          }

          a.button {
            display: inline-block;
            background-color: #007aff;
            color: white;
            font-weight: 600;
            font-size: 17px;
            text-decoration: none;
            padding: 14px 48px;
            border-radius: 22px;
            box-shadow:
              0 8px 15px rgba(0, 122, 255, 0.3);
            transition: background-color 0.25s ease;
            user-select: none;
          }

          a.button:hover {
            background-color: #005ecb;
            box-shadow:
              0 10px 20px rgba(0, 94, 203, 0.4);
          }
        </style>
      </head>
      <body>
        <div class="card" role="main" aria-labelledby="title" aria-describedby="desc">
          <svg
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <circle cx="12" cy="16" r="1" />
          </svg>

          <h1 id="title">404</h1>
          <h2>Page Not Found</h2>
          <p id="desc">Sorry, the page you are looking for doesn’t exist or has been moved.</p>
          <a href="/" class="button" role="button">Go Back Home</a>
        </div>
      </body>
    </html>
  `);
};
