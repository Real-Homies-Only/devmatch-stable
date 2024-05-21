# DevMatch

This is the final project for Software Engineering 2nd Year.

## Running the application

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to access the web app.

## Accessing environmental variables

Environmental variables are distributed to our professor
through this [Google Drive](https://drive.google.com/drive/folders/15DJ6Q3sGVdlKXBZCBersG_SpUyRHxLTY?usp=sharing)

## Testing

Make sure to use the testing environmental variables before running tests and put the **firebase-admin.json** in the root folder.

```bash
npm test
```

Change the **assert** to **with** or vice versa in the **/db/teardownDb.mjs** file for varying Node.js versions
if the tests fail with errors pointing to that line of code.

In the Selenium phase, please do not click on the browser while it is running to avoid abruptly failing tests.
