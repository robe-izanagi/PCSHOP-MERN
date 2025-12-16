PC Shop Backend (MERN - MongoDB)

1) Install
   cd backend
   npm install

2) Create .env from .env.example
   Fill MONGO_URI (e.g. mongodb://localhost:27017/pcshop_db)
   Fill all neccessary field

3) Seed product (run seed):
   node seed/seedProductFull.js
   node seed/seedPurchases.js
   node seed/seedUsesrsFake.js

4) Run server:
   npm run dev    # uses nodemon
   or
   npm start

Admin hard-coded credentials:
email: pcshopfarol@admin-cics.com
password: admin-cics-3103-sia
