/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.hadoop.examples;

import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.GenericOptionsParser;

public class VMDKSizeCount {

	public static class TokenizerMapper extends Mapper<Object, Text, Text, IntWritable> {

		private final static IntWritable one = new IntWritable(1);
		private Text word = new Text();
		private int bundle_id = -1;
		private long bundle_sz = 0;

		public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
			String str[] = value.toString().split(":");
			if (str.length > 1) {
				try {
					int id = Integer.parseInt(str[0]);
					String[] cur = str[1].split(new String(" "));
					if (cur.length == 4) {
						if(cur[2].equals("VMFS")) {
							try {
								long cur_sz = Integer.parseInt(cur[1])/1024/1024;
								if(id != bundle_id)
								{
									bundle_sz = bundle_sz;
									word.set(String.valueOf(bundle_sz));
									context.write(word, one);
									bundle_sz = cur_sz;
								}
								else
								{
									bundle_sz += cur_sz;
								}
								bundle_id = id;
							} catch (Exception e) {
							
							}
						}
					}
				
				} catch (Exception e)
				{
					
				}
			}
		}
	}

		public static class IntSumReducer extends Reducer<Text, IntWritable, Text, IntWritable> {
			private IntWritable result = new IntWritable();

			public void reduce(Text key, Iterable<IntWritable> values, Context context)
					throws IOException, InterruptedException {
				int sum = 0;
				for (IntWritable val : values) {
					sum += val.get();
				}
				result.set(sum);
				context.write(key, result);
			}
		}

		public static void main(String[] args) throws Exception {
			System.err.println("****************");
			Configuration conf = new Configuration();
			String[] otherArgs = new GenericOptionsParser(conf, args).getRemainingArgs();
			if (otherArgs.length < 2) {
				System.err.println("Usage: VMDKSizeCount <in> [<in>...] <out>");
				System.exit(2);
			}
			Job job = Job.getInstance(conf, "word count");
			job.setJarByClass(VMDKSizeCount.class);
			job.setMapperClass(TokenizerMapper.class);
			job.setCombinerClass(IntSumReducer.class);
			job.setReducerClass(IntSumReducer.class);
			job.setOutputKeyClass(Text.class);
			job.setOutputValueClass(IntWritable.class);
			for (int i = 0; i < otherArgs.length - 1; ++i) {
				FileInputFormat.addInputPath(job, new Path(otherArgs[i]));
			}
			FileOutputFormat.setOutputPath(job, new Path(otherArgs[otherArgs.length - 1]));
			System.exit(job.waitForCompletion(true) ? 0 : 1);
		}
}
