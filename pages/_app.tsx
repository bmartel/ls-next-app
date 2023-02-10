import dynamic from 'next/dynamic'
import type { AppProps } from 'next/app'
import "@/styles/globals.css"

const LabelStudioWrapper = dynamic(() => import('../components/LabelStudio'), {
  loading: () => <p>Loading LabelStudio...</p>,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LabelStudioWrapper>
      <Component {...pageProps} />
    </LabelStudioWrapper>
  )
}
