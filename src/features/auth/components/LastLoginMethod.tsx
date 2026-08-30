import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation(['auth', 'common'])

  return (
    <TooltipProvider>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{t('auth:lastLoginMethod.lastUsed')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default LastLoginMethod
