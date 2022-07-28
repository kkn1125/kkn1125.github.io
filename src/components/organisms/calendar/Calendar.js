import React, { memo, useState } from "react";
import { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import todoStorage from "../../../data/todo.json";
import { Badge, Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers";

const tagIcon = {
  undefined: "▷",
  "": "▷",
  rest: "☕",
  study: "📖",
  alert: "📢",
  1: "🥇",
  2: "🥈",
  3: "🥉",
  edit: "🔧",
  idea: "💡",
  know: "❗",
  how: "❓",
  check: "✅",
  cancel: "❎",
  prj: "🔮",
};

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [todo, setTodo] = useState([]);

  const handleDate = (newDate) => {
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const date = newDate.getDate();
    setTodo(todoStorage?.[year]?.[month]?.[date]);
    setDate(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container gap={3} justifyContent='center' alignItems='flex-start'>
        <Grid
          item
          sx={{
            "& .PrivatePickersSlideTransition-root [role='grid']": {
              pt: 2,
            },
            "& .MuiTypography-root.MuiTypography-caption": {
              color: (theme) => theme.palette.text.primary,
              "&:last-child": {
                color: (theme) => theme.palette.primary.main,
              },
              "&:first-child": {
                color: (theme) => theme.palette.danger.main,
              },
            },
          }}>
          <CalendarPicker
            date={date}
            onChange={handleDate}
            renderDay={(date, selectedDates, pickersDayProps) => {
              const _year = pickersDayProps.day.getFullYear();
              const _month = pickersDayProps.day.getMonth();
              const _date = pickersDayProps.day.getDate();
              const isTodo = todoStorage?.[_year]?.[_month]?.[_date];
              const today = new Date();
              const year = today.getFullYear();
              const month = today.getMonth();
              const isSameYear = _year >= year;
              const isSameMonth = _month >= month;
              return (
                <Box component='div' role='row' key={date}>
                  <Badge
                    component='div'
                    color='warning'
                    variant='dot'
                    invisible={!isTodo}>
                    <PickersDay
                      {...pickersDayProps}
                      sx={{
                        color: (theme) =>
                          isSameYear && isSameMonth
                            ? theme.palette.text.primary
                            : theme.palette.text.primary + 66,
                      }}
                      outsideCurrentMonth={
                        false
                        // !(isSameYear && isSameMonth)
                      }
                      today
                    />
                  </Badge>
                </Box>
              );
            }}
          />
        </Grid>
        <Grid item xs={12} md>
          <Stack gap={3}>
            {todo &&
              todo.length > 0 &&
              todo.map((item, idx) => (
                <Stack
                  key={item.todo + idx}
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  alignItems={{
                    xs: "flex-start",
                    md: "center",
                  }}
                  gap={{
                    xs: 1,
                    md: 3,
                  }}>
                  {/* <Chip component='span' label={idx + 1} color='info' /> */}
                  <Stack direction='row' gap={1} alignItems='center'>
                    <Chip
                      component='span'
                      label={tagIcon[item.tag]}
                      variant='outlined'
                      sx={{
                        fontSize: (theme) => theme.typography.pxToRem(12),
                      }}
                    />
                    <Typography component='span'>{item.todo}</Typography>
                  </Stack>
                  <Typography
                    component='span'
                    sx={{
                      color: (theme) => theme.palette.grey,
                      fontSize: (theme) => theme.typography.pxToRem(12),
                    }}>
                    {item.time}
                  </Typography>
                </Stack>
              ))}
            {(!todo || todo.length === 0) && (
              <Typography>등록된 일정 없습니다.</Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}

export default memo(Calendar);
