import React from 'react';
import {QRCodeSVG} from 'qrcode.react';  // Correct import for the default export

const Qrcode = ({ address }) => {
  return (
    <div>
      <div>
        <h2 className="text-white text-2xl font-semibold">Scan the QR Code</h2>
        
        {/* QR Code Component */}
        <QRCodeSVG 
          value={address}  // Address is passed as a prop to the QRCode component
          size={200}       // Size of the QR code
          bgColor="#ffffff" // Background color of the QR code
          fgColor="#000000" // Foreground color of the QR code
          level="H"        // Error correction level (H is high)
        />

        <div className="mt-4">
          <p className="text-white text-lg">Use this QR code to share the address.</p>
        </div>
      </div>
    </div>
  );
};

export default Qrcode;
