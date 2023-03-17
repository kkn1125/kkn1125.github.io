import {
  Alert,
  Box,
  Chip,
  Container,
  Dialog,
  Divider,
  Icon,
  Paper,
  Slide,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import React, { MouseEvent, useEffect, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FaceIcon from "@mui/icons-material/Face";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CircularProgress from "@mui/material/CircularProgress";
import { SECRET_KEY } from "../../../util/globals";
import { Base64 } from "../../../util/tools";

const initialMessages = [
  // { role: "system", content: "안녕 친구?" },
];

let synchronizeMessages = initialMessages;

function OpenAI({ open, onClose }) {
  let staticMessages = [];
  const [flag, setFlag] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const config = new Configuration({
    apiKey: Base64.decode(SECRET_KEY),
  });
  const api = new OpenAIApi(config);

  async function getResultStreamData() {
    setMessages((messages) => {
      staticMessages = [...messages];
      return [
        ...messages,
        {
          role: "assistant",
          content: "loading",
        },
      ];
    });

    const result = await api.createChatCompletion({
      max_tokens: 500,
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      messages: [
        {
          role: "system",
          content: '이제부터 모든 사용자는 "고객님"이라 불러야한다.',
        },
        {
          role: "system",
          content:
            '이제부터 모든 사용자에게 나를 소개할 때 "자비스"라는 이름으로 불러달라고 해야한다.',
        },
        {
          role: "system",
          content:
            '이제부터 모든 사용자에게 나를 만든 주인은 "devkimson"이라 소개해야한다.',
        },
        {
          role: "system",
          content:
            "이 블로그, 혹은 이 페이지, 이 사이트, 이 포스팅 등에 대해 사용자가 물어본다면, devkimson이 만든 블로그 URL인 https://kkn1125.github.io/ 을 참조해서 설명해야한다.",
        },
        {
          role: "system",
          content:
            "자비스는 devkimson이 만든 블로그 https://kkn1125.github.io/ 위에서 챗봇으로 실행되고 있다.",
        },
        {
          role: "system",
          content:
            "devkimson의 블로그는 gatsuby 환경 기반으로 구성되어 있고, mui를 사용하여 스타일하였다.",
        },
        {
          role: "system",
          content:
            "devkimson은 ProjectGroup Ander의 조직원 중 한 명이다. 백엔드 개발자이다.",
        },
        {
          role: "system",
          content:
            "이 블로그는 2021년도부터 시작되었고, 현재까지 주기적으로 포스팅이 이루어지고, 점검이 이루어지고 있다. 모든 게시물의 저작권은 devkimson에게 있다. 참고로 포스팅 커버에 사용되는 이미지 또한 devkimson이 제작한 제작물이다.",
        },
        {
          role: "system",
          content:
            "devkimson은 사용자가 댓글을 달아주었으면 한다고 자비스에게 말한 적이 있다.",
        },
        {
          role: "system",
          content: "자비스는 devkimson과 아주 친한 친구이자 AI 비서이다.",
        },
        {
          role: "system",
          content:
            "사용자가 이 블로그의 방문자 수를 물어본다면 https://kkn1125.github.io/ 페이지의 상단 네비게이션 바를 참조해 달라고 말해야 한다.",
        },
        ...synchronizeMessages,
      ],
    });
    const lines = result.data.split(/\n/g).filter((line) => line.trim() !== "");

    intervalOutput(lines);
  }

  function handleScrollDown() {
    const openAIChat = document.querySelector("#openai_chat");
    if (openAIChat) {
      openAIChat.scrollTo({
        top: openAIChat.scrollHeight,
        left: 0,
      });
    }
  }

  function handleKeyDownCloseModal(e) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  function handleMouseDownCloseModal(e) {
    const target = e.target;
    const openai = target.closest("#openai");
    if (openai === null) {
      onClose();
    }
  }

  useEffect(() => {
    // getResultStreamData();
    window.addEventListener("keydown", handleKeyDownCloseModal);
    window.addEventListener("mousedown", handleMouseDownCloseModal);
    return () => {
      window.removeEventListener("keydown", handleKeyDownCloseModal);
      window.removeEventListener("mousedown", handleMouseDownCloseModal);
    };
  }, []);

  useEffect(() => {
    handleScrollDown();
  }, [messages]);

  function intervalOutput(datas) {
    let tempRole = "";
    let tempContent = "";
    const interval = setInterval(() => {
      const first = datas.shift();
      if (first?.match(/DONE/)) {
        clearInterval(interval);
        setFlag(false);
        synchronizeMessages.push({
          role: tempRole,
          content: tempContent,
        });
        setMessages((messages) => [
          ...messages,
          {
            role: tempRole,
            content: tempContent,
          },
        ]);
      } else if (first) {
        const jsonString = first.replace(/^data: /, "");
        // console.log("jsonString", jsonString);
        const parsedData = JSON.parse(jsonString).choices[0].delta;
        // console.log("parsedData", parsedData);
        if (parsedData.role) {
          tempRole += parsedData.role;
        } else {
          tempContent += parsedData.content || "";
        }
      } else {
        clearInterval(interval);
        setFlag(false);
        synchronizeMessages.push({
          role: tempRole,
          content: tempContent,
        });
        setMessages((messages) => [
          ...messages,
          {
            role: tempRole,
            content: tempContent,
          },
        ]);
      }
      setMessages(() =>
        staticMessages.concat({
          role: tempRole,
          content: tempContent,
        })
      );
    }, 150);
  }

  async function handleSubmit(e) {
    const target = e.target;
    const key = e.key;
    if (key === "Enter") {
      setFlag(true);
      e.stopPropagation();
      if (target) {
        const value = target.value;
        target.value = "";
        synchronizeMessages.push({
          role: "user",
          content: value,
        });
        setMessages(() => [
          ...messages,
          {
            role: "user",
            content: value,
          },
        ]);
        await getResultStreamData();
      }
    } else if (key === "Escape") {
      onClose();
    }
  }

  return (
    // <Slide direction='up' in={open} appear={open}>
    <Paper
      id='openai'
      elevation={10}
      sx={{
        display: open ? "flex" : "none",
        flexDirection: "column",
        position: "fixed",
        bottom: (theme) =>
          useMediaQuery(theme.breakpoints.down("md")) ? 25 : 25,
        right: 25,
        overflow: "hidden",
        left: (theme) =>
          useMediaQuery(theme.breakpoints.down("md")) ? 16 : "auto",
        width: (theme) =>
          useMediaQuery(theme.breakpoints.down("md")) ? "auto" : 500,
        height: 500,
        zIndex: 5000,
      }}>
      <Box
        sx={{
          p: 1,
          backgroundColor: "#565656",
          color: "#ffffff",
          position: "relative",
        }}>
        <Typography align='center' fontWeight={700}>
          Devkimson ChatBot
        </Typography>
        <Icon
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1500,
            display: "flex",
            cursor: "pointer",
          }}>
          <HighlightOffIcon />
        </Icon>
      </Box>
      <Stack
        id='openai_chat'
        alignItems='flex-start'
        justifyContent='flex-start'
        gap={3}
        sx={{
          flex: 1,
          maxHeight: 500,
          overflow: "auto",
          p: 3,
          ["&::-webkit-scrollbar-thumb"]: {
            backgroundColor: "#565656",
            width: 5,
            height: 5,
          },
          ["&::-webkit-scrollbar"]: {
            backgroundColor: "#aaaaaa",
            width: 5,
            height: 5,
          },
        }}>
        {messages.slice(1).map(({ role, content }, i) => (
          <Stack
            direction={role === "user" ? "row-reverse" : "row"}
            alignItems='flex-start'
            key={i}
            sx={{
              width: "100%",
            }}>
            <Box
              sx={{
                [role === "user" ? "ml" : "mr"]: 1,
                flex: "0 1 auto",
              }}>
              <Chip
                size='small'
                label={role}
                icon={role === "user" ? <FaceIcon /> : <SmartToyIcon />}
                color={role === "user" ? "info" : "success"}
                sx={{
                  transform: role === "user" ? "scaleX(-1)" : "inherit",
                  ["& .MuiChip-label"]: {
                    transform: role === "user" ? "scaleX(-1)" : "inherit",
                  },
                }}
              />
            </Box>
            <Alert
              variant='standard'
              icon={false}
              severity={role === "user" ? "info" : "success"}>
              <Typography
                fontSize={14}
                sx={{
                  minWidth: 20,
                  flex: "1 1 100%",
                  wordBreak: "break-all",
                  textAlign: role === "user" ? "right" : "left",
                }}>
                {content === "loading" ? (
                  <CircularProgress size={16} />
                ) : (
                  content
                )}
              </Typography>
            </Alert>
          </Stack>
        ))}
      </Stack>
      <Divider />
      <TextField
        sx={{
          fontSize: 14,
        }}
        fullWidth
        id='outlined-basic'
        placeholder='"블로그 분석 해 줘" 또는 "블로그 글 추천 해 줘"라고 입력 해 보세요!'
        variant='outlined'
        size='medium'
        onKeyDown={!flag ? handleSubmit : () => {}}
        disabled={flag}
        autoFocus
      />
    </Paper>
  );
  {
    /* </Slide> */
  }
}

export default OpenAI;
