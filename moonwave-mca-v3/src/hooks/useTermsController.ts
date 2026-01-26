import { useUIStore } from '@/stores/uiStore';
import { PRIVACY_POLICY_DATA, TERMS_DATA } from '../components/layout/TermsData';

export const useTermsController = () => {
  const isOpen = useUIStore((state) => state.isTermsModalOpen);
  const closeModal = useUIStore((state) => state.closeTermsModal);

  return {
    isOpen,
    closeModal,
    terms: TERMS_DATA,
    privacy: PRIVACY_POLICY_DATA,
  };
};
