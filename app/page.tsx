"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Copy, Plus, Grid3X3, Moon, Sun, Sparkles, RotateCcw, Check, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GridItem {
  id: string
  row: number
  col: number
  rowSpan: number
  colSpan: number
  color: string
}

interface ColumnWidth {
  type: "fr" | "px" | "auto" | "%"
  value: number
}

interface CopyState {
  css: boolean
  tailwind: boolean
  jsx: boolean
  html: boolean
}

const ITEM_COLORS = [
  "#FFB3BA", // Light Pink
  "#FFDFBA", // Light Orange
  "#FFFFBA", // Light Yellow
  "#BAFFC9", // Light Green
  "#BAE1FF", // Light Blue
  "#FFB3E6", // Light Magenta
  "#C9BAFF", // Light Purple
  "#FFCCCB", // Light Red
  "#D4EDDA", // Light Mint
  "#CCE5FF", // Light Sky Blue
  "#FFE4E1", // Misty Rose
  "#E6E6FA", // Lavender
]

export default function GridCraft() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [columns, setColumns] = useState(5)
  const [rows, setRows] = useState(5)
  const [gap, setGap] = useState(8)
  const [columnWidths, setColumnWidths] = useState<ColumnWidth[]>(Array(5).fill({ type: "fr", value: 1 }))
  const [gridItems, setGridItems] = useState<GridItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showControls, setShowControls] = useState(false)
  const [copyStates, setCopyStates] = useState<CopyState>({
    css: false,
    tailwind: false,
    jsx: false,
    html: false,
  })
  const { toast } = useToast()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Update column widths when columns change
  const handleColumnsChange = (newColumns: number) => {
    setColumns(newColumns)
    const newColumnWidths = Array(newColumns)
      .fill(null)
      .map((_, index) => columnWidths[index] || { type: "fr", value: 1 })
    setColumnWidths(newColumnWidths)
  }

  const updateColumnWidth = (index: number, type: ColumnWidth["type"], value: number) => {
    const newColumnWidths = [...columnWidths]
    // Round to 1 decimal place for fr units, whole numbers for others
    const roundedValue = type === "fr" ? Math.round(value * 10) / 10 : Math.round(value)
    newColumnWidths[index] = { type, value: Math.max(type === "fr" ? 0.1 : 1, roundedValue) }
    setColumnWidths(newColumnWidths)
  }

  const getItemColor = (index: number) => {
    return ITEM_COLORS[index % ITEM_COLORS.length]
  }

  const resetGrid = () => {
    setGridItems([])
    setSelectedItems([])
    setColumns(5)
    setRows(5)
    setGap(8)
    setColumnWidths(Array(5).fill({ type: "fr", value: 1 }))
    toast({
      title: "Grid Reset",
      description: "Grid has been reset to default state.",
    })
  }

  const handleCellClick = useCallback(
    (row: number, col: number, event: React.MouseEvent) => {
      const existingItem = gridItems.find(
        (item) => row >= item.row && row < item.row + item.rowSpan && col >= item.col && col < item.col + item.colSpan,
      )

      if (existingItem) {
        // Toggle selection of existing item
        if (event.ctrlKey || event.metaKey) {
          // Multi-select with Ctrl/Cmd
          setSelectedItems((prev) =>
            prev.includes(existingItem.id) ? prev.filter((id) => id !== existingItem.id) : [...prev, existingItem.id],
          )
        } else {
          // Single select or remove item if already selected
          if (selectedItems.includes(existingItem.id) && selectedItems.length === 1) {
            // Remove item if it's the only selected item
            setGridItems((prev) => prev.filter((item) => item.id !== existingItem.id))
            setSelectedItems([])
          } else {
            // Select only this item
            setSelectedItems([existingItem.id])
          }
        }
      } else {
        // Add new item
        const newItem: GridItem = {
          id: Date.now().toString(),
          row,
          col,
          rowSpan: 1,
          colSpan: 1,
          color: getItemColor(gridItems.length),
        }
        setGridItems((prev) => [...prev, newItem])
        setSelectedItems([newItem.id])
      }
    },
    [gridItems, selectedItems],
  )

  const updateItemSpan = (itemId: string, rowSpan: number, colSpan: number) => {
    setGridItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              rowSpan: Math.max(1, Math.min(rows - item.row + 1, rowSpan)),
              colSpan: Math.max(1, Math.min(columns - item.col + 1, colSpan)),
            }
          : item,
      ),
    )
  }

  const generateColumnWidthsCSS = () => {
    return columnWidths
      .map((width) => {
        if (width.type === "fr") return `${width.value}fr`
        if (width.type === "auto") return "auto"
        return `${width.value}${width.type}`
      })
      .join(" ")
  }

  const generateCSS = useCallback(() => {
    const containerCSS = `.grid-container {
  display: grid;
  grid-template-columns: ${generateColumnWidthsCSS()};
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gap}px;
}`

    const itemsCSS = gridItems
      .map(
        (item, index) =>
          `.grid-item-${index + 1} {
  grid-row: ${item.row} / ${item.row + item.rowSpan};
  grid-column: ${item.col} / ${item.col + item.colSpan};
}`,
      )
      .join("\n\n")

    return `${containerCSS}\n\n${itemsCSS}`
  }, [columnWidths, rows, gap, gridItems])

  const generateTailwindCSS = useCallback(() => {
    const colsClass = columns <= 12 ? `grid-cols-${columns}` : `grid-cols-[repeat(${columns},1fr)]`
    const rowsClass = rows <= 12 ? `grid-rows-${rows}` : `grid-rows-[repeat(${rows},1fr)]`
    const gapClass = gap === 0 ? "gap-0" : gap <= 12 ? `gap-${gap}` : `gap-[${gap}px]`

    const containerClasses = `grid ${colsClass} ${rowsClass} ${gapClass}`

    const itemsClasses = gridItems
      .map((item, index) => {
        const rowStart = item.row <= 13 ? `row-start-${item.row}` : `row-start-[${item.row}]`
        const rowEnd =
          item.rowSpan > 1
            ? item.row + item.rowSpan <= 14
              ? `row-end-${item.row + item.rowSpan}`
              : `row-end-[${item.row + item.rowSpan}]`
            : ""
        const colStart = item.col <= 13 ? `col-start-${item.col}` : `col-start-[${item.col}]`
        const colEnd =
          item.colSpan > 1
            ? item.col + item.colSpan <= 14
              ? `col-end-${item.col + item.colSpan}`
              : `col-end-[${item.col + item.colSpan}]`
            : ""

        const classes = [rowStart, rowEnd, colStart, colEnd].filter(Boolean).join(" ")

        return `.grid-item-${index + 1} {
  @apply ${classes};
}`
      })
      .join("\n\n")

    return `/* Container */
.grid-container {
  @apply ${containerClasses};
}

/* Grid Items */
${itemsClasses}`
  }, [columns, rows, gap, gridItems])

  const generateTailwindJSX = useCallback(() => {
    const colsClass = columns <= 12 ? `grid-cols-${columns}` : `grid-cols-[repeat(${columns},1fr)]`
    const rowsClass = rows <= 12 ? `grid-rows-${rows}` : `grid-rows-[repeat(${rows},1fr)]`
    const gapClass = gap === 0 ? "gap-0" : gap <= 12 ? `gap-${gap}` : `gap-[${gap}px]`

    const containerClasses = `grid ${colsClass} ${rowsClass} ${gapClass}`

    const items = gridItems
      .map((item, index) => {
        const rowStart = item.row <= 13 ? `row-start-${item.row}` : `row-start-[${item.row}]`
        const rowEnd =
          item.rowSpan > 1
            ? item.row + item.rowSpan <= 14
              ? `row-end-${item.row + item.rowSpan}`
              : `row-end-[${item.row + item.rowSpan}]`
            : ""
        const colStart = item.col <= 13 ? `col-start-${item.col}` : `col-start-[${item.col}]`
        const colEnd =
          item.colSpan > 1
            ? item.col + item.colSpan <= 14
              ? `col-end-${item.col + item.colSpan}`
              : `col-end-[${item.col + item.colSpan}]`
            : ""

        const classes = [rowStart, rowEnd, colStart, colEnd].filter(Boolean).join(" ")

        return `  <div className="${classes}">
    Item ${index + 1}
  </div>`
      })
      .join("\n")

    return `<div className="${containerClasses}">
${items}
</div>`
  }, [columns, rows, gap, gridItems])

  const generateHTML = useCallback(() => {
    const items = gridItems
      .map((_, index) => `  <div class="grid-item-${index + 1}">Item ${index + 1}</div>`)
      .join("\n")

    return `<div class="grid-container">
${items}
</div>`
  }, [gridItems])

  const copyToClipboard = async (text: string, type: keyof CopyState) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }

      setCopyStates((prev) => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [type]: false }))
      }, 2000)

      toast({
        title: "Copied to clipboard!",
        description: `${type.toUpperCase()} code has been copied to your clipboard.`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please manually select and copy the code.",
        variant: "destructive",
      })
    }
  }

  const isItemAtPosition = (row: number, col: number) => {
    return gridItems.find(
      (item) => row >= item.row && row < item.row + item.rowSpan && col >= item.col && col < item.col + item.colSpan,
    )
  }

  const getItemAtPosition = (row: number, col: number) => {
    return gridItems.find((item) => item.row === row && item.col === col)
  }

  const selectedItemData = selectedItems.length === 1 ? gridItems.find((item) => item.id === selectedItems[0]) : null

  // Controls Panel Component
  const ControlsPanel = () => (
    <div className="space-y-6">
      {/* Grid Settings Card */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Grid Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="columns" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Columns
              </Label>
              <Input
                id="columns"
                type="number"
                min="1"
                max="12"
                value={columns}
                onChange={(e) => handleColumnsChange(Number.parseInt(e.target.value) || 1)}
                className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 h-10"
              />
            </div>
            <div>
              <Label htmlFor="rows" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rows
              </Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="12"
                value={rows}
                onChange={(e) => setRows(Number.parseInt(e.target.value) || 1)}
                className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 h-10"
              />
            </div>
            <div>
              <Label htmlFor="gap" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Gap(px)
              </Label>
              <Input
                id="gap"
                type="number"
                min="0"
                max="50"
                value={gap}
                onChange={(e) => setGap(Number.parseInt(e.target.value) || 0)}
                className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 h-10"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block text-gray-700 dark:text-gray-300">Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "3×3", cols: 3, rows: 3, gap: 10 },
                { name: "4×4", cols: 4, rows: 4, gap: 15 },
                { name: "5×5", cols: 5, rows: 5, gap: 8 },
                { name: "6×4", cols: 6, rows: 4, gap: 12 },
              ].map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleColumnsChange(preset.cols)
                    setRows(preset.rows)
                    setGap(preset.gap)
                  }}
                  className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-10"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Column Widths Card - Enhanced */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-900 dark:text-white flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Column Widths
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newWidths = Array(columns).fill({ type: "fr", value: 1 })
                setColumnWidths(newWidths)
              }}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Reset All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
            {columnWidths.map((width, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <Label className="text-sm font-medium w-12 text-gray-900 dark:text-gray-100 flex-shrink-0 text-center font-bold">
                  {index + 1}
                </Label>
                <Select
                  value={width.type}
                  onValueChange={(value: ColumnWidth["type"]) => updateColumnWidth(index, value, width.value)}
                >
                  <SelectTrigger className="w-20 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500 h-9 text-sm text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">fr</SelectItem>
                    <SelectItem value="px">px</SelectItem>
                    <SelectItem value="%">%</SelectItem>
                    <SelectItem value="auto">auto</SelectItem>
                  </SelectContent>
                </Select>
                {width.type !== "auto" ? (
                  <Input
                    type="number"
                    min="1"
                    step={width.type === "fr" ? "0.1" : "1"}
                    value={width.value}
                    onChange={(e) => updateColumnWidth(index, width.type, Number.parseFloat(e.target.value) || 1)}
                    className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500 h-9 text-sm text-gray-900 dark:text-gray-100 font-medium"
                    placeholder="Value"
                  />
                ) : (
                  <div className="flex-1 h-9 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 rounded border border-dashed">
                    auto
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Presets for Column Widths */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Label className="text-xs font-medium mb-2 block text-gray-600 dark:text-gray-400">Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setColumnWidths(Array(columns).fill({ type: "fr", value: 1 }))}
                className="text-xs h-7 px-2 bg-white/50 dark:bg-gray-700/50"
              >
                Equal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newWidths = Array(columns)
                    .fill(null)
                    .map((_, i) => (i === 0 ? { type: "fr", value: 2 } : { type: "fr", value: 1 }))
                  setColumnWidths(newWidths)
                }}
                className="text-xs h-7 px-2 bg-white/50 dark:bg-gray-700/50"
              >
                2:1:1...
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newWidths = Array(columns)
                    .fill(null)
                    .map((_, i) =>
                      i === Math.floor(columns / 2) ? { type: "fr", value: 2 } : { type: "fr", value: 1 },
                    )
                  setColumnWidths(newWidths)
                }}
                className="text-xs h-7 px-2 bg-white/50 dark:bg-gray-700/50"
              >
                Center Wide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Span Controls */}
      {selectedItemData && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Item Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Row Span</Label>
                <Input
                  type="number"
                  min="1"
                  max={rows - selectedItemData.row + 1}
                  value={selectedItemData.rowSpan}
                  onChange={(e) =>
                    updateItemSpan(selectedItemData.id, Number.parseInt(e.target.value) || 1, selectedItemData.colSpan)
                  }
                  className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 h-10"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Col Span</Label>
                <Input
                  type="number"
                  min="1"
                  max={columns - selectedItemData.col + 1}
                  value={selectedItemData.colSpan}
                  onChange={(e) =>
                    updateItemSpan(selectedItemData.id, selectedItemData.rowSpan, Number.parseInt(e.target.value) || 1)
                  }
                  className="mt-1 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 h-10"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Item {gridItems.findIndex((i) => i.id === selectedItemData.id) + 1} • Position: Row {selectedItemData.row}
              , Col {selectedItemData.col}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"}`}
    >
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Grid3X3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GridCraft
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Advanced Grid Builder</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isMobile && (
                <Sheet open={showControls} onOpenChange={setShowControls}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Grid Controls</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <ControlsPanel />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-gray-500" />
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative transition-colors duration-200"
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                      isDarkMode ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <Moon className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Hero Section - Hidden on mobile */}
        {!isMobile && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-purple-500 mr-2" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                GridCraft
              </h2>
              <Sparkles className="h-8 w-8 text-blue-500 ml-2" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced CSS Grid builder with spanning controls. Click to add items, select to adjust row/column spans.
            </p>
          </div>
        )}

        <div className={`grid gap-4 lg:gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-4"}`}>
          {/* Controls - Desktop */}
          {!isMobile && (
            <div className="xl:col-span-1">
              <ControlsPanel />
            </div>
          )}

          {/* Grid Editor */}
          <div className={`${isMobile ? "col-span-1" : "xl:col-span-3"}`}>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-gray-900 dark:text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Visual Grid Editor
                  </div>
                  <Button variant="outline" size="sm" onClick={resetGrid}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Click to add spanning items • Ctrl+Click for multi-select • Select item to adjust spans
                </div>
                <div
                  className="w-full p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl overflow-auto"
                  style={{
                    display: "grid",
                    gridTemplateColumns: generateColumnWidthsCSS(),
                    gridTemplateRows: `repeat(${rows}, ${isMobile ? "60px" : "80px"})`,
                    gap: `${gap}px`,
                    minWidth: isMobile ? "300px" : "600px",
                  }}
                >
                  {Array.from({ length: rows }, (_, rowIndex) =>
                    Array.from({ length: columns }, (_, colIndex) => {
                      const row = rowIndex + 1
                      const col = colIndex + 1
                      const item = isItemAtPosition(row, col)
                      const isOrigin = getItemAtPosition(row, col)
                      const isSelected = item && selectedItems.includes(item.id)

                      if (item && !isOrigin) {
                        return null
                      }

                      return (
                        <div
                          key={`${row}-${col}`}
                          className={`
                            border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center
                            transition-all duration-200 hover:scale-105 font-bold text-lg
                            ${
                              item
                                ? `shadow-md border-gray-400 dark:border-gray-500 ${
                                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 scale-105" : ""
                                  }`
                                : "bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:border-blue-400 dark:hover:border-blue-500"
                            }
                          `}
                          style={
                            item
                              ? {
                                  gridRow: `${item.row} / ${item.row + item.rowSpan}`,
                                  gridColumn: `${item.col} / ${item.col + item.colSpan}`,
                                  backgroundColor: item.color,
                                  color: "#374151",
                                  minHeight: isMobile ? "60px" : "80px",
                                }
                              : { minHeight: isMobile ? "60px" : "80px" }
                          }
                          onClick={(e) => handleCellClick(row, col, e)}
                        >
                          {item ? (
                            <div className="text-center">
                              <div className="text-gray-800 font-bold text-lg">
                                {gridItems.findIndex((i) => i.id === item.id) + 1}
                              </div>
                              {(item.rowSpan > 1 || item.colSpan > 1) && (
                                <div className="text-xs text-gray-600 mt-1">
                                  {item.colSpan}×{item.rowSpan}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Plus className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-gray-400`} />
                          )}
                        </div>
                      )
                    }),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Code */}
        <div className="mt-4 lg:mt-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 dark:text-white flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                Generated Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="css" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="css" className="text-xs sm:text-sm">
                    CSS
                  </TabsTrigger>
                  <TabsTrigger value="tailwind" className="text-xs sm:text-sm">
                    Tailwind
                  </TabsTrigger>
                  <TabsTrigger value="jsx" className="text-xs sm:text-sm">
                    JSX
                  </TabsTrigger>
                  <TabsTrigger value="html" className="text-xs sm:text-sm">
                    HTML
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="css" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</h4>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateCSS(), "css")}>
                      {copyStates.css ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copyStates.css ? "Copied!" : "Copy CSS"}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                    <code>{generateCSS()}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="tailwind" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tailwind CSS Code</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateTailwindCSS(), "tailwind")}
                    >
                      {copyStates.tailwind ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copyStates.tailwind ? "Copied!" : "Copy Tailwind"}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                    <code>{generateTailwindCSS()}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="jsx" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Tailwind JSX Code</h4>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateTailwindJSX(), "jsx")}>
                      {copyStates.jsx ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copyStates.jsx ? "Copied!" : "Copy JSX"}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                    <code>{generateTailwindJSX()}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="html" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">HTML Code</h4>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateHTML(), "html")}>
                      {copyStates.html ? (
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copyStates.html ? "Copied!" : "Copy HTML"}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
                    <code>{generateHTML()}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
