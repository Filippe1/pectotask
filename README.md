This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started
You need to install sqlite3 and sqlite before you run the project:
```bash
npm install sqlite3
npm install sqlite
```

Now you can run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Important
The sqlite database (which is the file rustofin.db generated in database folder) is generated by 
the sqlscript.js that populates the database from the data.json file.  
The sqlscript.js is always run when you use command 'npm run dev'. To prevent it from running in
development you can remove it from the package.json file: 

'''json
"scripts": {
    "dev": "node pages/database/sqlscript.js && next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
'''

