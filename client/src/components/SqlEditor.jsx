import Editor from '@monaco-editor/react'

export default function SqlEditor({ value, onChange }) {
  return (
    <div className="editor" role="region" aria-label="SQL Editor">
      <Editor
        height="240px"
        defaultLanguage="sql"
        value={value}
        onChange={(v) => onChange(v || '')}
        options={{ fontSize: 14, minimap: { enabled: false } }}
      />
    </div>
  )
}