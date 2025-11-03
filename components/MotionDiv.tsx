import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

export default function MotionDiv(props: PropsWithChildren<any>) {
  return <motion.div {...props}>{props.children}</motion.div>;
} 