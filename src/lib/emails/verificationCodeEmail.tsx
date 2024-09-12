import * as React from "react"

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  // Img,
  // Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { sendEmail } from "./emailConfig"

export function VerificationCodeEmail({ token }: { token: string }) {
  return (
    <Html>
      <Head />
      <Preview>Login Token</Preview>
      <Tailwind>
        <React.Fragment>
          <Body className="bg-white my-auto mx-auto font-sans">
            <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
              <Section className="text-center mt-[32px] mb-[32px]">
                <Text className="text-black font-medium text-[14px] leading-[24px] mb-8">Enter the following token to login.</Text>

                <Text className="text-black font-medium text-[14px] leading-[24px]">
                  Your token is: <code>{token}</code>
                </Text>
              </Section>

              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

              <Text className="text-[#666666] text-[12px] leading-[24px] flex items-center justify-center">
                © {new Date().getFullYear()} Popuply. All rights reserved.
              </Text>
            </Container>
          </Body>
        </React.Fragment>
      </Tailwind>
    </Html>
  )
}

export const VerificationCodeText = ({ token }: { token: string }) => `Enter the following token to login. Your token is: ${token}`

export async function sendVerificationCodeEmail({ email, token }: { email: string; token: string }) {
  await sendEmail({
    subject: "Verify your email",
    email: email,
    content: <VerificationCodeEmail token={token} />,
    text: VerificationCodeText({ token }),
  })
}
