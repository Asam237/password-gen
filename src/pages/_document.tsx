import { PoppinsUiDisplay } from "@/lib/fonts";
import cn from "clsx";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { DefaultSeo } from "next-seo";

export default class Index extends Document {
  render() {
    return (
      <Html
        className={cn(PoppinsUiDisplay.variable, PoppinsUiDisplay.className)}
      >
        <Head />
        <DefaultSeo
          title={"Password Generator By ASAM"}
          description={"Password Generator By ASAM"}
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
