export default function HintBar({ hint, verification }) {
  return (
    <div className="hintbar">
      {verification && (
        <span className={`tag ${verification.status === 'match' ? 'tag--ok' : 'tag--warn'}`}>
          {verification.status === 'match' ? 'Matches expected' : 'Does not match expected'}
        </span>
      )}
      {hint && <span className="hintbar__hint">Hint: {hint}</span>}
    </div>
  )}