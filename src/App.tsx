import './App.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Main from "./Main";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 1000
    },
  },
})

/*
 * App with theme.
 */
export default function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <ReactQueryDevtools/>
            <Main/>
        </BrowserRouter>
      </QueryClientProvider>
  );
}