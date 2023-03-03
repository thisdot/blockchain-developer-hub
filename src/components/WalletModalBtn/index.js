import PropTypes from 'prop-types';
import { useWeb3Modal } from '@web3modal/react';

const WalletModalBtn = ({ children, ...props }) => {
  const { open } = useWeb3Modal();

  const handleClick = async () => {
    await open({ route: 'ConnectWallet' });
  };

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  );
};

WalletModalBtn.propTypes = {
  children: PropTypes.node,
};

WalletModalBtn.defaultProps = {
  children: 'Connect Wallet',
};

export default WalletModalBtn;
