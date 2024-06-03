const truncateString =(string, maxLength) => {
    if (string.length > maxLength) {
      return string.slice(0, maxLength - 3) + "..."
    }
    return string
  }

export default truncateString;