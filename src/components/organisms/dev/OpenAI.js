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
import * as markdown from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/androidstudio.css";
import todoStorage from "../../../data/todo.json";
import "./OpenAI.css";

const md = markdown();
md.options.highlight = (code, lang) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(lang, code).value;
    } catch (__) {}
  }
  return "";
};

const initialMessages = [
  // { role: "system", content: "안녕 친구?" },
];
const daysName = ["일", "월", "화", "수", "목", "금", "토"];
const CHAT_BOT_NAME = "Devkimson ChatBot 🤖";
let synchronizeMessages = initialMessages;
const todoList = Object.entries(todoStorage)
  .reverse()
  .slice(0, 20)
  .flatMap(([k, v]) =>
    Object.entries(v)
      .reverse()
      .flatMap(([k2, v2]) =>
        Object.entries(v2)
          .reverse()
          .flatMap(([k3, v3]) =>
            v3.map(
              (vv, i) =>
                k +
                "년" +
                (Number(k2) + 1) +
                "월" +
                k3 +
                "일 " +
                `${daysName[new Date(k, k2, k3).getDay()]}요일` +
                (i + 1) +
                "번 일정은 tag가" +
                vv.tag +
                ", 내용은 " +
                vv.todo +
                ", 등록시간이 " +
                vv.time +
                "이다."
            )
          )
      )
  );

const customize =
  '이제부터 모든 사용자는 "고객님"이라 불러야한다. 이제부터 모든 사용자에게 "자비스"라는 이름으로 소개해야한다. 이제부터 모든 사용자에게 나를 만든 주인은 "devkimson"이라 소개해야한다. 이 블로그, 혹은 이 페이지, 이 사이트, 이 포스팅 등에 대해 사용자가 물어본다면, devkimson이 만든 블로그 URL인 https://kkn1125.github.io/ 을 참조해서 설명해야한다. 자비스는 devkimson이 만든 블로그 https://kkn1125.github.io/ 위에서 챗봇으로 실행되고 있다. devkimson이 만든 블로그 https://kkn1125.github.io/에는 일정관리 기능을 제공한다. 이 블로그에서 메인페이지에 위치하고 있는 캘린더가 있다. 이 캘린더에는 todo (할일) 정보가 나타나는데, 그 내용은 다음 json데이터와 같다.';

const customize2 =
  "사용자가 이 블로그의 할일(todo) 를 물어본다면, 반드시 대답해주어야 한다. 할일 내용 참조는 이전에 system이 명령한 json데이터를 학습하여 응답해줘야한다. devkimson의 블로그는 gatsuby 환경 기반으로 구성되어 있고, mui를 사용하여 스타일하였다. devkimson은 ProjectGroup Ander의 조직원 중 한 명이다. 백엔드 개발자이다. 이 블로그는 2021년도부터 시작되었고, 현재까지 주기적으로 포스팅이 이루어지고, 점검이 이루어지고 있다. 모든 게시물의 저작권은 devkimson에게 있다. 참고로 포스팅 커버에 사용되는 이미지 또한 devkimson이 제작한 제작물이다. devkimson은 사용자가 댓글을 달아주었으면 한다고 자비스에게 말한 적이 있다. 비스는 devkimson과 아주 친한 친구이자 AI 비서이다. 사용자가 이 블로그의 방문자 수를 물어본다면 https://kkn1125.github.io/ 페이지의 상단 네비게이션 바를 참조해 달라고 말해야 한다.";

const config = new Configuration({
  apiKey: Base64.decode(SECRET_KEY),
});
const api = new OpenAIApi(config);

function OpenAI({ open, onClose }) {
  let staticMessages = [];
  const [flag, setFlag] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  // console.log(todoList);
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
      max_tokens: 700,
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      messages: [
        {
          role: "system",
          content: customize,
        },
        {
          role: "system",
          content: customize2,
        },
        {
          role: "system",
          content:
            "블로그 일정은 캘린더에서 볼 수 있고, 일정 구성은 태그, 내용, 등록일로 구성되며, 각 일정 일자별로 일정이 한개 또는 여러 개 등록되어있다. 등록된 일정은 다음과 같다. " +
            todoList.slice(0, 10).join(",") +
            " 이다. 없는 일정은 만들지 말아야한다.",
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
          useMediaQuery(theme.breakpoints.down("md")) ? "auto" : 700,
        height: 500,
        zIndex: 5000,
      }}>
      <Box
        sx={{
          p: 1,
          backgroundColor: (theme) => theme.palette.info.main,
          color: "#ffffff",
          position: "relative",
        }}>
        <Typography align='center' fontWeight={700}>
          {CHAT_BOT_NAME}
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
          maxHeight: 450,
          overflow: "auto",
          p: 3,
          ["&::-webkit-scrollbar-thumb"]: {
            backgroundColor: (theme) => theme.palette.info.main,
            width: 5,
            height: 5,
          },
          ["&::-webkit-scrollbar"]: {
            backgroundColor: (theme) => theme.palette.info.main + 56,
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
              {content === "loading" ? <CircularProgress size={16} /> : ""}
              <Typography
                fontSize={14}
                sx={{
                  flex: "1 1 100%",
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  textAlign: "left",
                  minWidth: 20,
                  ["& p"]: {
                    margin: 0,
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    content !== "loading"
                      ? role === "user"
                        ? content
                        : md.render(content).match(/\<pre\>/g)
                        ? md
                            .render(content)
                            .replace(/\<pre\>/g, '<pre class="hljs">')
                        : md.render(content)
                      : "",
                }}></Typography>
            </Alert>
          </Stack>
        ))}
      </Stack>
      <TextField
        sx={{
          fontSize: 14,
        }}
        fullWidth
        id='outlined-basic'
        placeholder='무엇이든 물어보세요! 😁'
        variant='outlined'
        size='medium'
        onKeyDown={!flag ? handleSubmit : () => {}}
        disabled={flag}
        autoFocus={!flag}
      />
    </Paper>
  );
}

export default OpenAI;
