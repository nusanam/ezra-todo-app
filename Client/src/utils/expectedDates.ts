const now = new Date();
const today = now.toISOString().split('T')[0];

export default {
  today,
  yesterday: new Date(now.setDate(now.getDate() - 1))
    .toISOString()
    .split('T')[0],
  tomorrow: new Date(now.setDate(now.getDate() + 2))
    .toISOString()
    .split('T')[0],
};
