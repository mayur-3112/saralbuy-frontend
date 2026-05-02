import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const TooltipComp = ({ hoverChildren, contentChildren }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{hoverChildren}</TooltipTrigger>
      <TooltipContent>{contentChildren}</TooltipContent>
    </Tooltip>
  );
};

export default TooltipComp;
