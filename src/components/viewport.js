import React from "react";
import { Helmet } from "react-helmet";

const scripts = `window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-179074259-1');`;



export default function Viewport({ children }) {

  return (
    <Helmet>
      {/* To ensure proper rendering and touch zooming for all devices, add the responsive viewport meta tag to your <head> element. */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content='https://kkn1125.github.io' />
      <meta name='viewport' content='initial-scale=1, width=device-width' />
      <meta name="google-site-verification" content="pPnTHKfNmML6i8GiyBMZNoyhbvX7i0SmgjNmj8r4Aos" />
      <meta name="naver-site-verification" content="6cebf2441529d02294b07c32ba2cd5ce09ba2c71" />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7028508433313066"
        crossorigin="anonymous"></script>
      {/* <!-- Google tag (gtag.js) --> */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-179074259-1"></script>
      <script type="text/javascript">
        {scripts}
      </script>
      {children}
    </Helmet>
  );
}
