import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ChakraProvider} from '@chakra-ui/react';

import {AppLayout} from './components/AppLayout';
import {ApiTestPage} from './pages/ApiTestPage';
import {NotFoundPage} from './pages/NotFoundPage';
import {RecipeListPage} from './pages/RecipeListPage';
import {RecipeDetailPage} from './pages/RecipeDetailPage';
import {SideDishesPage} from "./pages/SideDishesPage";
import {AddNewRecipePage} from "./pages/AddNewRecipePage";
import {EditDetailRecipePage} from "./pages/EditDetailRecipePage"

export const App = () => {
  return (
    <BrowserRouter>
      <ChakraProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<RecipeListPage/>}/>
            <Route path="/recept/:slug" element={<RecipeDetailPage/>}/>
            <Route path="/api-test" element={<ApiTestPage/>}/>
            <Route path="/side-dishes" element={<SideDishesPage/>}/>
            <Route path="/new-recipe" element={<AddNewRecipePage/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
            <Route path="recept/:slug/edit" element={<EditDetailRecipePage/>}/>
          </Routes>
        </AppLayout>
      </ChakraProvider>
    </BrowserRouter>
  );
}
