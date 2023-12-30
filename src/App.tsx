import './App.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {CssBaseline} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
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
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <CssBaseline enableColorScheme/>
            <ReactQueryDevtools/>
            <Main/>
          </LocalizationProvider>
        </BrowserRouter>
      </QueryClientProvider>
  );
}