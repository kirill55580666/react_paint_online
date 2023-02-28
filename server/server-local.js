'use strict';

const PORT = process.env.PORT || 5000
const app = require('./index');

app.listen(PORT, () => console.log(`Local app listening on port ${PORT}!`));