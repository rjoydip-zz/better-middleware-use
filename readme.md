# better-middleware-use

Better use of middleware.

## What is middleware?

Middleware functions are `functions` that have access to the `request object (req)`, the `response object (res)`, and the `next` function in the application’s `request-response cycle`. 

The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.

The `request-response cycle` ends when you call `res.send()` or `res.end()`.

## Why middleware needed in the application?

- Execute any code on every request.
- Make changes to the request and the response objects.

## Example

```js
"use strict";

const express = require('express');

const app = express();

app.config = {
  PORT: 3000,
  ENV: process.env.NODE_ENV || 'development',
  HOST: '127.0.0.1'
};

const midOne = (req, res, next) => {
  console.log("midOne");
  next();
}

const midTwo = (req, res, next) => {
  console.log("midTwo");
  next();
}

app.use((req, res, next) => {
  console.log(1);
  next();
});

app.use((req, res, next) => {
  console.log(2);
  next();
});

app.get('/', [midOne, midTwo], (req, res) => {
  res.send("Root");
});

app.get('/home', [midTwo], (req, res) => {
  res.send("Home");
});

app.listen(8080, () => {
  console.log(app.config);
  console.log("Server is running on port 8080");
});
```

The global `middleware` will be called for each `request`. It's better to `keep clean`, as `minimum` as use, always be `async`, avoid `complex computation`.

If any computation needed across multiple routes it should apply on routes.

## Should or shouldn't

- If any middleware performs based on some condition better to use condition outside middleware.

```js
// bad
app.use((req, res, next) => {
    if(some condition) {} 
    else {}
    next();
});

// good
if(condition) {
    app.use((req, res, next) => {
        next();
    });
}
```

- Apply middlware on preticualr route or through `req` and `res`.

```js
app.get('/events', function (req, res) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')

  // send a ping approx every 2 seconds
  var timer = setInterval(function () {
    res.write('data: ping\n\n')

    // !!! this is the important part
    res.flush()
  }, 2000)

  res.on('close', function () {
    clearInterval(timer)
  })
})
```

- Always add configuration/metadata outside middleware.

```js
// bad
app.use((req, res, next) => {
    app.config = {
        PORT: 3000,
        ENV: process.env.NODE_ENV || 'development',
        HOST: '127.0.0.1'
    };
    next();
});
// good
app.config = {
    PORT: 3000,
    ENV: process.env.NODE_ENV || 'development',
    HOST: '127.0.0.1'
};
app.use((req, res, next) => {
    next();
});
```

## License

MIT © [Joydip Roy](https://github.com/rjoydip)
