import Head from 'next/head'
import {Dispatch, memo, SetStateAction, useState} from 'react'
import Script from 'next/script'

const ImportHead = function ({isUseCodeMirror}: { isUseCodeMirror: boolean }) {
  const [isLoadedJquery, setIsLoadedJquery] = useState(false)
  return (
    <>
      <ScriptMemorized
        keyScript="jquery"
        src="/static/jquery-3.5.1.min.js?v=1.0"
        onLoad={setIsLoadedJquery}
      />
      {isLoadedJquery && (
        <>
          <Script
            key="bootstrap.min.js"
            src="/static/bootstrap/bootstrap.min.js?v=1.0"
          />
          <Script
            key="summernote.min.js"
            src="/static/summernote/summernote.min.js?v=1.0"
          />
        </>
      )}
      {isUseCodeMirror && isLoadedJquery && (
        <>
          <Script
            key="codemirror.js"
            src="/static/codemirror/codemirror.js?v=1.0"
          />
          <Script
            key="codemirror/xml.js"
            src="/static/codemirror/xml.js?v=1.0"
          />
          <Script
            key="codemirror/formatting.js"
            src="/static/codemirror/formatting.js?v=1.0"
          />
        </>
      )}
      <Head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          key="summernote.min.css"
          href="/static/summernote/summernote.min.css?v=1.0"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          key="editor.css"
          href="/static/summernote/editor.css?v=1.0"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          key="bootstrap.min.css"
          href="/static/bootstrap/bootstrap.min.css?v=1.0"
          rel="stylesheet"
        />
        {isUseCodeMirror ? (
          <>
            {/* eslint-disable-next-line @next/next/no-css-tags */}
            <link
              key="codemirror.css"
              href="/static/codemirror/codemirror.css?v=1.0"
              rel="stylesheet"
            />
            {/* eslint-disable-next-line @next/next/no-css-tags */}
            <link
              key="monokai.css"
              href="/static/codemirror/monokai.css?v=1.0"
              rel="stylesheet"
            />
          </>
        ) : (
          <></>
        )}
      </Head>
    </>
  )
}

const ScriptMemorized = memo(function ScriptMemorized(
  {keyScript, src, onLoad} : {keyScript: string, src: string, onLoad: Dispatch<SetStateAction<boolean>>}
) {
  return (
    <Script key={keyScript} src={src} onLoad={() =>onLoad(true)} />
  )
})

export default memo(ImportHead)
