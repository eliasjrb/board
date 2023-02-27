import { Header } from "../components/Header";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const inicialOptions = {
  "client-id": "AdBOXnpRc24_UgbghMHuE5mc7vPEj5K2EwYcIkT9QKKMUWrRL9lcTtPgoxU5l4oAPt2W8HRK2dfC4lh2",
  currency: "BRL",
  intent: "capture"
}

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <PayPalScriptProvider options={ inicialOptions} >
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </SessionProvider>
  )
}
