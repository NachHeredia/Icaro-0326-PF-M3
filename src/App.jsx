import { useMemo } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore";
import { getTheme } from "./theme/theme";
import Sidebar from "./components/SideBar";
import TasksPage from "./pages/TaskPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const mode = useThemeStore((state) => state.mode);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box
            component="main"
            sx={{ flexGrow: 1, minWidth: 0, p: 3, pt: { xs: 10, md: 3 } }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/tareas" replace />} />
              <Route path="/tareas" element={<TasksPage />} />
              <Route path="/tareas/:id" element={<TaskDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
