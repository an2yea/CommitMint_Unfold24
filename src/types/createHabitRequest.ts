interface CreateHabitContractRequest {
    userId: string;
    habitId: string;
    habitVerifier: string;
    username: string;
    days: number;
    freePasses: number;
    stake: number;
    title: string;
    subtitle: string;
  }

export default CreateHabitContractRequest;