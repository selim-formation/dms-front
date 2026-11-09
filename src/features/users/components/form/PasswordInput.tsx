import { memo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'

interface PasswordInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
    showLabel: string
    hideLabel: string
}

/** Password field with a show / hide toggle (always LTR: passwords are not translated text). */
function PasswordInput({ showLabel, hideLabel, ...props }: PasswordInputProps) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative">
            <Input {...props} type={visible ? 'text' : 'password'} dir="ltr" className="pe-10" />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                disabled={props.disabled}
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                aria-label={visible ? hideLabel : showLabel}
                aria-pressed={visible}
            >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    )
}

export default memo(PasswordInput)
