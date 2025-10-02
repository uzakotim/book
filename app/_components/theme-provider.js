"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import PropTypes from "prop-types"

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  enableSystem: PropTypes.bool,
  disableTransitionOnChange: PropTypes.bool,
  defaultTheme: PropTypes.oneOf(["system", "light", "dark"]),
}

ThemeProvider.defaultProps = {
  enableSystem: true,
  disableTransitionOnChange: false,
  defaultTheme: "system",
}
export function ThemeProvider({
  children,
  ...props
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}