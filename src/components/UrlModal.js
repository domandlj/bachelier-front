import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SquareButton from './SquareButton';
import { faCopy,faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const isMobile = /Mobi|Android/i.test(navigator.userAgent);


const UrlModal = ({ isUrlModalOpen, setIsUrlModalOpen, url }) => {
    const copyToClipboard = () => {
        if (url){
            navigator.clipboard.writeText(url);
        }
    };

    return (
        <Modal
            open={isUrlModalOpen}
            onClose={()=> setIsUrlModalOpen(false)}
            aria-labelledby="url-modal-title"
            aria-describedby="url-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'black',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography id="url-modal-title" variant="h6" component="h2">
                        <FontAwesomeIcon icon={faLink}/> Share
                    </Typography>
                    <IconButton onClick={()=> setIsUrlModalOpen(false)}>
                        <CloseIcon sx={{color:"white"}} />
                    </IconButton>
                </Box>
                <Typography
  id="url-modal-description"
  sx={{
    margin: 1,
    wordBreak: 'break-all',
    backgroundColor: '#1e1e1e',
    borderRadius: '2px',
    fontFamily: 'monospace',
    color: 'white', // Optional: to make the text stand out
  }}
>
  {url}
</Typography>
            {!isMobile ? (
                <SquareButton icon={faCopy} onClick={copyToClipboard} />
            ): <Typography>Copy this link to share the model</Typography>}
            </Box>
        </Modal>
    );
};

export default UrlModal;
