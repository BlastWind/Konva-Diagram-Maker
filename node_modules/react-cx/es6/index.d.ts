import * as React from 'react'

declare module 'react' {
  export interface HTMLAttributes<T> extends React.DOMAttributes<T> {
    cx?: string | object | (string | object)[];
  }
}

export default function getReactWithCX(styles: object): typeof React;