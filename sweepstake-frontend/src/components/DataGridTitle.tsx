import { Box, Typography } from "@mui/material";

export function DataGridTitle(title: string, index: number) {
    const colours = ["#bf2932", "#589043", "#23658e"];
    const firstColour = colours[index % 3];
    const secondColour = colours[(index + 1) % 3];
    return (
        <Box style={{ 
                width: "100%", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                background: `linear-gradient(45deg, ${firstColour} 30%, ${secondColour} 90%)`
            }}>
            <Typography variant="h6">{title}</Typography>
        </Box>
    )
}