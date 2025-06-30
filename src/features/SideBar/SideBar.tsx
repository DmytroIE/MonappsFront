import Box from '@mui/material/Box';

import NodeTree from '../NodeTree/NodeTree';

const SideBar = ({addStyles}: {addStyles?: React.CSSProperties}) => {
  //const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, { name }: MenuItemProps) => { setActiveItem(name as string) }

  return (
        <Box sx={{ bgcolor: 'rgba(246, 246, 245)', ...addStyles}}>
          <NodeTree/>
        </Box>);
}

export default SideBar;