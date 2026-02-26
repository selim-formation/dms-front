import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"

const LastLoginMethod = ({
  children,
  defaultOpen,
}: {
  children: React.ReactElement
  defaultOpen: boolean
}) => {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right">
          <p>Last used</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LastLoginMethod
