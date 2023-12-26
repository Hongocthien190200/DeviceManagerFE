import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './routes';
import { DefaultLayout } from './Components/Layout';
import React from 'react';
import { useSelector } from "react-redux";

function App() {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component
            let Layout = DefaultLayout
            if (route.layout) {
              Layout = route.layout
            } else if (route.layout === null) {
              Layout = Fragment
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          {currentUser ? (
            privateRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })
          ) : (
            // Nếu không có currentUser, điều hướng đến trang /login
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
