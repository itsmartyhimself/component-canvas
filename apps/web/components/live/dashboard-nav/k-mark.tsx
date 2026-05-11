interface KMarkProps {
  height?: number
}

export function KMark({ height = 10 }: KMarkProps) {
  return (
    <svg
      height={height}
      viewBox="0 0 6 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={{ width: "auto", flexShrink: 0 }}
    >
      <path
        d="M0.912274 5.80753V4.41553L4.60827 -0.000469208H5.88027L0.912274 5.80753ZM0.000273466 8.51953V-0.000469208H1.03227V8.51953H0.000273466ZM4.72827 8.51953L1.75227 4.19953L2.47227 3.45553L6.00027 8.51953H4.72827Z"
        fill="currentColor"
      />
    </svg>
  )
}
