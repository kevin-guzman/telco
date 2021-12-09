import React, { useState } from "react";
import { QueryClientProvider } from "react-query";
import { QueryClient } from "react-query";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Header } from "./componets/header";
import { ProductsContext } from "./context/products-context";
import {
  AuthenticationContext,
  userShape,
} from "./context/authentication-context";
import { Cart } from "./routes/cart";
import { Home } from "./routes/home";
import { Login } from "./routes/login";

const imageUrl =
  "http://assets.stickpng.com/images/580b57fcd9996e24bc43c1e5.png";

export const RouterHandler = () => {
  const queryClient = new QueryClient();
  const [products, setProducts] = useState({
    products: [
      { id: 0, name: "pizza", quantity: 0, imageUrl },
      { id: 1, name: "Otra pizza", quantity: 0, imageUrl },
      { id: 2, name: "Jamón", quantity: 0, imageUrl },
      { id: 3, name: "Hamburguesa", quantity: 0, imageUrl },
      { id: 4, name: "Osciloscopio", quantity: 0, imageUrl },
    ],
    changed: false,
  });
  const [user, setUser] = useState(userShape);
  const setProductQuantity = (id, quantity) => {
    if (quantity < 0) return null;
    const productsCopy = products.products;
    const indexInProducts = productsCopy.findIndex(
      (product) => product.id === id
    );
    const product = productsCopy[indexInProducts];
    product.quantity = quantity;
    productsCopy[indexInProducts] = product;
    setProducts((prevState) => ({
      changed: !prevState.changed,
      products: productsCopy,
    }));
  };
  const getProductsInCart = () => {
    return products.products.filter(({ quantity }) => quantity > 0);
  };
  const setAuthentication = (user = userShape) =>
    setUser((prevState) => ({ ...prevState, ...user }));
  const logOut = () => setAuthentication(userShape);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationContext.Provider
        value={{ setAuthentication, logOut, user }}
      >
        <ProductsContext.Provider
          value={{
            products: products.products,
            setProductQuantity,
            getProductsInCart,
          }}
        >
          <App />
        </ProductsContext.Provider>
      </AuthenticationContext.Provider>
    </QueryClientProvider>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route exact path="/cart">
            <Cart />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};