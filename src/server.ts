import express,{Express,Request,Response} from 'express'
import connectToDatabase from "./db"
import cors from 'cors'
import authRoutes from './authentication/Urls';
import crudRoutes from './crud/Urls';

const port = 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json())

//database connection
connectToDatabase();

// Available Routes
app.use('/auth', authRoutes);
app.use('/crud', crudRoutes);

// Run Server on specified port
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
