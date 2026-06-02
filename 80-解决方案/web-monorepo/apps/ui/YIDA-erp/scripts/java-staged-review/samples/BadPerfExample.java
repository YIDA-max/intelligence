package review.samples;

import java.io.BufferedReader;
import java.io.FileReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class BadPerfExample {

    // 这是一个故意写得不好的示例，用于测试 AI 审查脚本是否能抓到性能问题
    public static String run(List<String> ids) throws Exception {
        String result = "";
        List<String> all = new ArrayList<>();

        for (String id : ids) {
            // 1) 循环内重复创建高开销对象
            Pattern p = Pattern.compile("[0-9]+");
            BigDecimal fee = new BigDecimal("123.456");

            // 2) 循环内字符串 + 拼接
            result = result + id + "-" + fee.toPlainString();

            // 3) 模拟循环内远程/IO调用（这里用 sleep 代替）
            Thread.sleep(20);

            // 4) 低效线性查找 + 嵌套循环（可能 O(n^2)）
            for (String other : ids) {
                if (!all.contains(other) && p.matcher(other).matches()) {
                    all.add(other);
                }
            }
        }

        // 5) 资源未关闭（故意不用 try-with-resources）
        BufferedReader br = new BufferedReader(new FileReader("README.md"));
        String line = br.readLine();

        // 6) 热路径日志拼接（示意）
        System.out.println("debug info => " + result + " / " + line);

        return result;
    }
}
