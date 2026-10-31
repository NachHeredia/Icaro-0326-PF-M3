import { Box, Button, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import TaskCard from "./Taskcard";
import { STATUS_STYLES } from "../theme/statusStyles";

export default function Column({
  title,
  tasks,
  onChangeStatus,
  onDelete,
  onAdd,
}) {
  const { color, Icon } = STATUS_STYLES[title];

  return (
    <Box
      sx={{
        flex: { xs: "0 0 85%", md: "1 0 260px" },
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          borderRadius: "12px",
          bgcolor: alpha(color, theme.palette.mode === "light" ? 0.18 : 0.28),
        })}
      >
        <Icon sx={{ fontSize: 18, color }} />
        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{title}</Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {tasks.length}
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
          Todavía no hay tareas en esta columna.
        </Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onChangeStatus={onChangeStatus}
            onDelete={onDelete}
          />
        ))
      )}

      <Button
        fullWidth
        onClick={() => onAdd?.(title)}
        sx={(theme) => ({
          borderRadius: "12px",
          py: 0.75,
          fontSize: 14,
          fontWeight: 500,
          color: "text.secondary",
          bgcolor: alpha(theme.palette.text.primary, 0.05),
          "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.09) },
        })}
      >
        + Tarea
      </Button>
    </Box>
  );
}
