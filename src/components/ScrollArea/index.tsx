import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

import { forwardRef } from 'react';
import './index.less';

export const ScrollArea: typeof SimpleBar = forwardRef((props, ref) => {
  return (
    <SimpleBar
      {...props}
      ref={ref}
      scrollableNodeProps={{
        onScroll: props.onScroll,
        ...props.scrollableNodeProps,
      }}
    />
  );
});
