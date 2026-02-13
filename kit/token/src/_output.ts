export const output = (
  result: {status: 'success'; token: string} | {status: 'error'} | {status: 'skip'}
) => {
  switch (result.status) {
    case 'skip':
      console.log(JSON.stringify({status: 'skip'}));
      break;
    case 'success':
      console.log(JSON.stringify({status: 'success', token: result.token}));
      break;
    default:
      console.log(JSON.stringify({status: 'error'}));
  }
};
