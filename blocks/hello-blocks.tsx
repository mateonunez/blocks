import { FolderBlockProps } from "@githubnext/blocks";
import { Box } from "@primer/react";

export default function (props: FolderBlockProps) {
  return (
    <Box p={4}>
      <Box borderColor="border.default" borderWidth={1} borderStyle="solid" borderRadius={6} overflow="hidedn">
        Hello, Blocks!
      </Box>
    </Box>
  )
}