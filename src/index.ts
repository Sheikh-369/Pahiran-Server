import app from './app';
import dotenv from 'dotenv';
import { seedDefaultCategories } from './controllers/category-controller';
import { seedSubCategories } from './controllers/sub-category-controller';
dotenv.config();


const PORT = process.env.PORT;

function startServer() {
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    seedDefaultCategories()
    seedSubCategories()
    
  });
}

startServer();
