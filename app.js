const express = require("express");
const app = express();
const path = require("path");
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
